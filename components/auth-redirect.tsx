"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

export default function AuthRedirect({ domains }: { domains: string[] }) {
  const [open, setOpen] = useState(false);

  const checkDomainStatus = useCallback(async () => {
    for (const domain of domains) {
      const href = `https://${domain}`;

      try {
        const response = await axios.get(href);

        if (response.status === 200) {
          return href;
        }
      } catch (error) {
        console.log(`Error fetching ${href}:`, error);
      }
    }
    // 所有域名请求失败，返回错误信息
    throw new Error("All domains failed to fetch");
  }, [domains]);

  useEffect(() => {
    checkDomainStatus()
      .then((href) => {
        setTimeout(() => {
          window.location.href = href;
        }, 2000);
      })
      .catch(() => {
        setOpen(true);
      });
  }, []);

  return (
    <Modal isDismissable backdrop="blur" isOpen={open} onOpenChange={setOpen}>
      <ModalContent>
        <ModalHeader>系统维护中</ModalHeader>
        <ModalBody className="p-6">
          很抱歉，当前页面正在进行紧急维护，无法访问！
          <br />
          请您尝试稍后查看此页面，谢谢。
        </ModalBody>
        <ModalFooter>如有任何疑问，请联系我们的客服</ModalFooter>
      </ModalContent>
    </Modal>
  );
}
